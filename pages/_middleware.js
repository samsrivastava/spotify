import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req){
    const url = req.nextUrl.clone();
    // Token will exist if the user logged in
    const token = await getToken({ req, secret: process.env.JWT_SECRET});
    const {pathname} = req.nextUrl;


    // Allow the requests if the following is true
    // 1. It is a req for a next auth session and provider fetching
    // 2. The token exists

    if (pathname.includes('/api/auth') || token){
        return NextResponse.next();
    }


    // Redirect them to login if they dont have token AND are requesting for a protected route
    if (!token && pathname!== "/login"){
        url.pathname = "/login"
        return NextResponse.redirect(url);
    }
}