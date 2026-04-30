'use client';
// import React, { useState } from 'react'
import { useRazorpay } from "react-razorpay";
import axios from "axios";
import { useRouter } from "next/navigation";

const RazorPayButton = ({ amount, order_id, checkoutId }) => {
    const { error, isLoading, Razorpay } = useRazorpay();
    const router = useRouter();

    const handleFinalizeCheckout = async (checkoutId) => {
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    }
                }
            );
            console.log(response.data);
            router.push('/order-confirmation');
        } catch (error) {
            console.error(error);
        }
    };

    async function payNow() {
        // open razorpay checkout
        const options = {
            key: 'rzp_test_RVc3SrZU4EPVkd',
            amount: `${amount * 100}`, // Amount is in currency subunits.
            currency: 'INR',
            name: 'Vikrant Corp',
            description: 'Test Transaction',
            order_id, // this is the order_id created in the backend
            handler: async function (response) {
                const data = {
                    orderCreationId: order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpaySignature: response.razorpay_signature,
                    documentId: checkoutId,
                };

                const result = await axios.post("http://localhost:9000/api/payment/success", data, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    }
                });

                await handleFinalizeCheckout(checkoutId);
                alert(result.data.message);

            },
            callback_url: 'http://localhost:3000/payment-success', // your success url
            prefill: {
                name: 'Vikrant Kumar',
                email: 'vikrantmillion.48@gmail.com',
                contact: '7232812685'
            },
            theme: {
                color: '#F37254'
            },
            modal: {
                ondismiss: async function () {
                    try {
                        const result = await axios.put(`http://localhost:9000/api/payment/${checkoutId}/cancelled`, {}, {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                            }
                        });

                        console.log(result.data);
                        alert('Checkout modal was closed by the user');
                    } catch (error) {
                        console.error("cancellation request failed:", error.message);
                    }
                }
            }
        };

        // 3. Initialize and OPEN
        const rzp = new Razorpay(options); // Cast window as any in TS

        rzp.on('payment.failed', async function (response) {


            try {
                // this triggers when a payment actually fails
                console.log("Error Code:", response.error.code);
                console.log("Description:", response.error.description);
                console.log("Step:", response.error.step);
                console.log("Reason:", response.error.reason);

                // you can use response.error.metadata.order_id to track which order failed
                // alert("Payment failed: " + response.error.description);

                const result = await axios.put(`http://localhost:9000/api/payment/${checkoutId}/failed`, {}, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    }
                });

                console.log(result.data);
                alert('Checkout modal was closed by the user');
            } catch (error) {
                console.error("cancellation request failed:", error.message);
            }
        })

        rzp.open();
    }
    return (
        <div className="flex justify-center items-center bg-black p-3 text-white text-2xl hover:scale-95">
            {isLoading && <p>Loading Razorpay...</p>}
            {error && <p>Error loading Razorpay: {error}</p>}
            <button onClick={payNow} disabled={isLoading}>Pay Now</button>
        </div>
    )
}

export default RazorPayButton
