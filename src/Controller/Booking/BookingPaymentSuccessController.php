<?php

namespace App\Controller\Booking;

use App\Entity\Booking;
use App\Event\BookingSuccessEvent;
use App\Repository\BookingRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class BookingPaymentSuccessController extends AbstractController
{
    protected $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    #[Route('/booking/terminate/{id}', name: 'booking_payment_success')]
    #[IsGranted('ROLE_USER')]
    public function success($id, BookingRepository $bookingRepository, EventDispatcherInterface $dispatcher): Response
    {
        // 1. Je récupère la réservation
        $booking = $bookingRepository->find($id);

        if (
            !$booking ||
            ($booking && $booking->getBooker() !== $this->getUser()) ||
            ($booking && $booking->getStatus() === Booking::STATUS_PAID)
        ) {
            $this->addFlash("warning", "La réservation n'existe pas !");
            return $this->redirectToRoute('ads_index');
        }
        // 2. Je la fais passer au statut PAYEE (PAID)
        $booking->setStatus(Booking::STATUS_PAID);
        $this->em->flush();

        // 2.1 Lancer un événement qui permet d'envoyer un mail au paiement d'une réservation
        $bookingEvent = new BookingSuccessEvent($booking);
        $dispatcher->dispatch($bookingEvent, 'booking.success');

        // 3. Je redirige avec un flash vers la liste des réservations
        $this->addFlash("success", "La réservation a été payée et confirmée");
        return $this->redirectToRoute('booking_index');
    }
}
