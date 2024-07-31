import {auth, currentUser} from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import { stripe } from '@/lib/stripe';
import { absoluteUrl } from '@/lib/utils';
import { Currency } from 'lucide-react';
import { Description } from '@radix-ui/react-dialog';

const settingsUrl = absoluteUrl('/settings');

export async function GET() {
    try{
        const {userId} = auth();
        const user = await currentUser();

        if (!user || !userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const userSubscription = await prismadb.userSubscription.findUnique({
            where: {
                userId
            }
        });

        if (userSubscription && userSubscription.stripeCustomerID){
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: userSubscription.stripeCustomerID,
                return_url: settingsUrl
            });

            return new NextResponse(JSON.stringify({url: stripeSession.url}));
        }

        const stripeSession = await stripe.checkout.sessions.create({
            success_url: settingsUrl,
            cancel_url: settingsUrl,
            payment_method_types: ['card'],
            mode: 'subscription',
            billing_address_collection: "auto",
            customer_email: user.emailAddresses[0].emailAddress,
            line_items: [
                {
                    price_data:{
                        currency: 'usd',
                        product_data:{
                            name: 'Premium Subscription',
                            description: 'Unlock all premium features',
                        },
                        unit_amount: 2000,
                        recurring: {
                            interval: 'month',
                        },
                    },
                    quantity: 1,
                }
            ],
            metadata: {
                userId,
            }
        })

        return new NextResponse(JSON.stringify({url: stripeSession.url}));
    } catch (error) {
        console.error("Stripe Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}