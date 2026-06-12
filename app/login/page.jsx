"use client";

import { useEffect, useState } from "react";
import Image from 'next/image';


export default function Login() {
    return (
        <main className="p-8 w-full flex flex-col flex-1 items-center justify-center">
            <button className='flex gap-2 itens-center border p-2 rounded-md'>
                <Image src="google-color.svg" alt="Logo" width={20} height={20} />
                Login com Google
            </button>
        </main>
    )
}