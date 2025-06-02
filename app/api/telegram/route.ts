import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  );

  const body = await req.json();
  const message = body.message;

  if (!message?.from) {
    return NextResponse.json({ error: 'No user data' }, { status: 400 });
  }

  const user = message.from;

  const userProfileResponse = await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getUserProfilePhotos?user_id=${user.id}`
  );
  const userProfileData = await userProfileResponse.json();

  const userProfilePhotos = userProfileData?.result?.photos || [];

  await supabase.from('telegram_users').upsert({
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.username,
    language_code: user.language_code,
    profile_photos: userProfilePhotos,
  });

  // Optionally send a message to the user
//   await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       chat_id: message.chat.id,
//       text: `Hi ${user.first_name}! Your data has been saved ✅`
//     })
//   });

  return NextResponse.json({ success: true });
}
