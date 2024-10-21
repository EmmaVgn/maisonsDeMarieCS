<?php

namespace App\Controller\Booking;

use App\Entity\Booking;
use App\Stripe\StripeService;
use App\Repository\BookingRepository;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class BookingPaymentController extends AbstractController
{
    #[Route('/booking/pay/{id}', name: 'booking_payment_form')]
    #[IsGranted('ROLE_USER')]
    public function showCardForm($id, BookingRepository $bookingRepository, StripeService $stripeService)
    {
        $booking = $bookingRepository->find($id);
        if (
            !$booking ||
            ($booking && $booking->getBooker() !== $this->getUser()) ||
            ($booking && $booking->getStatus() === Booking::STATUS_PAID)
        ) {
            return $this->redirectToRoute('ads_index');
        }

        $intent = $stripeService->getPaymentIntent($booking);
        
        return $this->render('booking/payment.html.twig', [
            'clientSecret' => $intent->client_secret,
            'booking' => $booking,
            'stripePublicKey' => $stripeService->getPublicKey()
        ]);
    }
}
