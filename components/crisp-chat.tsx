"use client";

import { useEffect } from "react";
import {Crisp} from "crisp-sdk-web";

export const CrispChat = () => {
    useEffect(() => {
        Crisp.configure("13276cc1-7c1c-4edd-b6c8-3ce3ce1d7542")
    }, []);
    
    return null;
} 

