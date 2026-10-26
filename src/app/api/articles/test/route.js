import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "API Articles fonctionne" });
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const testData = {
      title: formData.get("title"),
      authorId: formData.get("authorId"),
      hasFormData: !!formData
    };
    
    return NextResponse.json({ 
      message: "Test POST réussi", 
      data: testData 
    });
  } catch (error) {
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
} 