import { NextResponse } from 'next/server';
import { GetObjectCommand } from '@aws-sdk/client-s3';
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

  const { modSlug } = await request.json();
  if (!modSlug) {
    return NextResponse.json({ error: 'modSlug is required' }, { status: 400 });
  }

  const { data: mod } = await supabase.from('mods').select('id, file_key').eq('slug', modSlug).single();
  if (!mod || !mod.file_key) {
    return NextResponse.json({ error: 'Mod not found' }, { status: 404 });
  }

  // This is the actual access gate: no completed purchase row, no link.
  const { data: purchase } = await supabase
    .from('purchases')
    .select('id')
    .eq('user_id', user.id)
    .eq('mod_id', mod.id)
    .eq('status', 'completed')
    .maybeSingle();

  if (!purchase) {
    return NextResponse.json({ error: "You haven't purchased this mod" }, { status: 403 });
  }

  const command = new GetObjectCommand({ Bucket: R2_BUCKET, Key: mod.file_key });
  const downloadUrl = await getSignedUrl(r2Client, command, { expiresIn: 300 }); // 5 minute link

  return NextResponse.json({ downloadUrl });
}
