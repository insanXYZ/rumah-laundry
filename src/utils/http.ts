import { ResponseSchema } from "@/app/dto/dto";
import { NextResponse } from "next/server";

export const ResponseOk = (data: any, message: string) => {
  const response: ResponseSchema = {
    data,
    message,
  };

  return NextResponse.json(response, {
    status: 200,
  });
};

export const ResponseErr = (message: string, error?: any) => {
  const response: ResponseSchema = {
    message,
  };

  if (error) {
    response.error = error instanceof Error ? error.message : undefined;
  }

  return NextResponse.json(response, {
    status: 400,
  });
};
