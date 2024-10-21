<?php

namespace App\Stripe;

use App\Entity\Booking;

class StripeService
{
    protected $secretKey;
    protected $publicKey;

    public function __construct(string $secretKey, string $publicKey)
    {
        $this->secretKey = $secretKey;
        $this->publicKey = $publicKey;
    }

    public function getPublicKey(): string
    {
        return $this->publicKey;
    }

    public function getPaymentIntent(Booking $booking)
    {
        \Stripe\Stripe::setApiKey($this->secretKey);
        return \Stripe\PaymentIntent::create([
            'amount' => $booking->getAmount(),
            'currency' => 'eur',
            'payment_method_types' => ['card', 'paypal'],
            // 'automatic_payment_methods' => [
            //     'enabled' => true,
            // ],
        ]);
    }
}