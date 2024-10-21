<?php
namespace App\Controller\Booking;
use App\Entity\User;
use App\Repository\BookingRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
class BookingListController extends AbstractController
{
    #[Route('/bookings', name: 'booking_index')]
    #[IsGranted('ROLE_USER', message: 'Vous devez être connecté pour accéder à vos voyages')]
    public function index(BookingRepository $bookingRepository): Response
    {
        // 1. Nous devons nous assurer que la personne est connectée sinon redirection vers la page d'accueil
        // 2. Nous voulons savoir qui est connecté ?
        /** @var User */
        $user = $this->getUser();
        $futureBookings = $bookingRepository->findFutureBookings($user);
        $pastBookings = $bookingRepository->findPastBookings($user);
        // 3. Nous voulons passer l'utilisateur à twig afin d'afficher ses commandes
        return $this->render('booking/index.html.twig', [
            'futureBookings' => $futureBookings,
            'pastBookings' => $pastBookings
        ]);
    }
    #[Route('/booking/show/{id}', name: 'booking_show', requirements: ["id" => '\d+'])]
    #[IsGranted('ROLE_USER')]
    public function show($id, BookingRepository $bookingRepository): Response
    {
        $booking = $bookingRepository->findOneBy([
            'id' => $id
        ]);
        if (!$booking) {
            throw $this->createNotFoundException("La réservation demandée n'existe pas");
        }
        return $this->render('booking/show.html.twig', [
            'booking' => $booking
        ]);
    }
}