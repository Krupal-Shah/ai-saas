"use client";

import {useState} from 'react';
import { Zap } from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";

interface subscriptionBtnProps {
    isPro: boolean;
}

export const SubscriptionBtn = ({ isPro = false}: subscriptionBtnProps) => {
    const [loading, setLoading] = useState(false);
    const onclick = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/stripe');
            window.location.href = response.data.url;
        } catch (error) {
            console.log("Billing error: ", error);
        } finally {
            setLoading(false);
        }
    }
    return (
        <Button disabled={loading} variant={isPro ? "default": "premium"} onClick={onclick}>
            {isPro ? "Manage Subscription" : "Upgrade to Pro"}
            {!isPro && <Zap className="w-4 h-4 ml-2 fill-white"/>}
        </Button>
    )
}