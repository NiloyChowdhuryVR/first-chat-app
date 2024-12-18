import { getToken } from "next-auth/jwt";
import {withAuth} from "next-auth/middleware";
import { NextResponse } from "next/server";


export default withAuth(async function middleware(req){
    const pathname = req.nextUrl.pathname
    const isAuth = await getToken({req}) //checks if user is authenticated
    const  isLoginPage = pathname.startsWith('/login')

    const sensitiveRoutes = ['/dashboard']
    const isAccessingSensitiveRoutes = sensitiveRoutes.some((route)=>pathname.startsWith(route))
    console.log(req.url)
    if(isLoginPage){
        if(isAuth){
            return NextResponse.redirect(new URL('/dashboard',req.url))
        }
        return NextResponse.next()
    }
    if(!isAuth && isAccessingSensitiveRoutes){
        return NextResponse.redirect(new URL('/login',req.url))
    }
    
    if(pathname === '/'){
        return NextResponse.redirect(new URL('/dashboard',req.url))
    }
},{
    callbacks:{
        async authorized(){
            return true
        }
    }
})

export const config={
    matcher: ['/','/login','/dashboard/:path*']
}