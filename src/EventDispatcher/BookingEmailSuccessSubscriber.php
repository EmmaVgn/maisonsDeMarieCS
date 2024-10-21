<?php

namespace App\EventDispatcher;

use App\Entity\User;
use App\Service\SendMailService;
use App\Event\BookingSuccessEvent;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class BookingEmailSuccessSubscriber implements EventSubscriberInterface
{
    protected $sendMail;
    protected $security;

    public function __construct(SendMailService $sendMail, Security $security)
    {
        $this->sendMail = $sendMail;

        $this->security = $security;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            'booking.success' => 'sendSuccessEmail'
        ];
    }
    
    public function sendSuccessEmail(BookingSuccessEvent $bookingSuccessEvent)
    {
        // 1. Récupérer l'utilisateur actuellement en ligne (service: Security)
        /** @var User */
        $currentUser = $this->security->getUser();
        // 2. Récupérer la réservation (je la trouve dans BookingSuccessEvent)
        $booking = $bookingSuccessEvent->getBooking();
        // 3. Envoyer le mail (service: SendMailService)
        $this->sendMail->sendEmail(
            "no-reply@monsite.net",
            "Votre commande",
            $currentUser->getEmail(),
            "Bravo votre commande n°{$booking->getId()} a bien été confirmée",
            "booking_success",

            [
                'booking' => $booking,
                'user' => $currentUser,
            ]
        );
    }
}