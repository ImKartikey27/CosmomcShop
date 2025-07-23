import { NextResponse, NextRequest } from 'next/server'
//in this file the 
 
export function middleware(request: NextRequest) {
    //ADMIN login middleware

   const {pathname} = request.nextUrl
   console.log(pathname);
   if(pathname.startsWith("/admin")){
      //admin login middleware
      const isPublicPath = pathname === "/admin/login" || pathname === "/admin/signup"
      const accessToken = request.cookies.get("accessToken")?.value;
      if(accessToken && isPublicPath){
        return NextResponse.redirect(new URL("/admin/dashboard",request.nextUrl))
      }
      if(!accessToken && !isPublicPath){
        return NextResponse.redirect(new URL("/admin/login",request.nextUrl))
      }
   }else if(pathname.startsWith("/user")){
    //user login middleware
    const isPublicPath = pathname === "/user/login" || pathname === "/user/product" || pathname === "/user/products"
    const token = request.cookies.get("token")?.value;
    if(token && isPublicPath){
      return NextResponse.redirect(new URL("/user/dashboard",request.nextUrl))
    }
    if(!token && !isPublicPath){
      return NextResponse.redirect(new URL("/user/login",request.nextUrl))
    }
   }else if(pathname.startsWith("/discord")){
    //discord login middleware only this part is left
    

   }
   

}
 
export const config = {
  matcher: [
    
  ],
}