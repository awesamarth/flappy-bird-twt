import AppKit
struct Rect:Decodable{let x:Double;let y:Double;let w:Double;let h:Double;let color:String;let angle:Double;let tx:Double;let ty:Double}
struct Frame:Decodable{let width:Int;let height:Int;let rectangles:[Rect]}
let frame=try JSONDecoder().decode(Frame.self,from:Data(contentsOf:URL(fileURLWithPath:CommandLine.arguments[1])))
let rep=NSBitmapImageRep(bitmapDataPlanes:nil,pixelsWide:frame.width*2,pixelsHigh:frame.height*2,bitsPerSample:8,samplesPerPixel:4,hasAlpha:true,isPlanar:false,colorSpaceName:.deviceRGB,bytesPerRow:0,bitsPerPixel:0)!
NSGraphicsContext.saveGraphicsState();NSGraphicsContext.current=NSGraphicsContext(bitmapImageRep:rep);NSGraphicsContext.current!.imageInterpolation = .none
let ctx=NSGraphicsContext.current!.cgContext;ctx.translateBy(x:0,y:CGFloat(frame.height*2));ctx.scaleBy(x:2,y:-2)
for r in frame.rectangles{let hex=String(r.color.dropFirst());let a=hex.count==4 ? Double(Int(String(hex.suffix(1)),radix:16)!)/15:1;let rgb=hex.count==3 || hex.count==4 ? String(hex.prefix(3)).map{String(repeating:String($0),count:2)}.joined():hex;let n=UInt32(rgb,radix:16)!;ctx.setFillColor(NSColor(calibratedRed:CGFloat((n>>16)&255)/255,green:CGFloat((n>>8)&255)/255,blue:CGFloat(n&255)/255,alpha:a).cgColor);ctx.saveGState();if r.angle != 0{ctx.translateBy(x:r.tx,y:r.ty);ctx.rotate(by:r.angle);ctx.translateBy(x:-r.tx,y:-r.ty)};ctx.fill(CGRect(x:r.x,y:r.y,width:r.w,height:r.h));ctx.restoreGState()}
NSGraphicsContext.restoreGraphicsState();try rep.representation(using:.png,properties:[:])!.write(to:URL(fileURLWithPath:CommandLine.arguments[2]))
