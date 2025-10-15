import { cookies } from 'next/headers'
 
export default async function setCookies(refreshToken:string) {
  const expiryDate = new Date( Date.now() + 60 * 60 * 1000 * 24 * 30); // 24 hour 30일
  const cookieStore = await cookies()
  cookieStore.set({
    name: 'refreshtoken',
    value: refreshToken,
    expires:expiryDate, 
    httpOnly: true,
    sameSite : true,
    path: '/',
  });
}