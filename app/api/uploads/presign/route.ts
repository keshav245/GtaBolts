import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createClient } from '@/lib/supabase/server';
import { r2Client, R2_BUCKET } from '@/lib/r2';

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  }

  // Employee-or-owner check (private.has_role isn't callable directly over
  // PostgREST — this queries user_roles, which RLS lets a user read for themselves).
  const { data: roles } = await supabase.from('user_roles').select('role').eq('user_id', user.id);
  const roleNames = (roles ?? []).map((r) => r.role as string);
  if (!roleNames.includes('employee') && !roleNames.includes('owner')) {
    return NextResponse.json({ error: 'Employee or owner role required' }, { status: 403 });
  }

  const { fileName, fileType, kind } = await request.json();
  if (!fileName || !fileType || (kind !== 'mod' && kind !== 'screenshot' && kind !== 'category')) {
    return NextResponse.json(
      { error: 'fileName, fileType, and kind ("mod" | "screenshot" | "category") are required' },
      { status: 400 }
    );
  }

  // Category photos are an owner-only action (category management is an
  // owner-only page), even though this endpoint is otherwise employee-or-owner.
  if (kind === 'category' && !roleNames.includes('owner')) {
    return NextResponse.json({ error: 'Owner role required for category images' }, { status: 403 });
  }

  const prefix = kind === 'mod' ? 'mod-files' : kind === 'screenshot' ? 'screenshots' : 'category-images';
  const key = `${prefix}/${user.id}/${randomUUID()}-${fileName}`;

  const command = new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, ContentType: fileType });
  const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 300 }); // 5 min to complete the PUT

  return NextResponse.json({ uploadUrl, key });
}
