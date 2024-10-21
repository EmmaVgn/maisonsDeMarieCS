<?php

namespace App\Controller\Booking;

use App\Entity\Booking;
use App\Form\BookingFormType;
use App\Repository\AdRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class BookingConfirmationController extends AbstractController
{
    protected $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    // #[Route('/booking/confirm/{slug}', name: 'booking_confirm')]
    // #[IsGranted('ROLE_USER', message: 'Vous devez être connecté pour confirmer une réservation')]
    // public function confirm($slug, AdRepository $adRepository, Request $request): Response
    // {
    //     $ad = $adRepository->findOneBy([
    //         'slug' => $slug
    //     ]);
    //     if (!$ad) {
    //         throw $this->createNotFoundException("L'annonce demandée n'existe pas");
    //     }
    //     // 1. Nous voulons lire les données du formulaire - Request
    //     $form = $this->createForm(BookingFormType::class);
    //     $form->handleRequest($request);
    //     // 2. Nous allons créer une réservation
    //     /** @var Booking */
    //     $booking = $form->getData();
    //     if ($form->isSubmitted() && $form->isValid()) {
    //         $user = $this->getUser();
    //         $booking->setBooker($user)
    //             ->setAd($ad);
    //         // Si les dates ne sont pas disponibles et continues, message d'erreur
    //         if (!$booking->isBookableDates() || !$booking->areDatesContinuous()) {
    //             $this->addFlash('warning', "Les dates que vous avez choisies ne peuvent être réservées : elles sont déjà prises.");
    //         } else {
    //             $this->em->persist($booking);
    //             $this->em->flush();
    //             return $this->redirectToRoute('booking_payment_form', [
    //                 'id' => $booking->getId()
    //             ]);
    //         }
    //     }
    //     return $this->render('ad/show.html.twig', [
    //         'ad' => $ad,
    //         'form' => $form->createView()
    //     ]);
    // }
    #[Route('/booking/confirm/{slug}', name: 'booking_confirm')]
    #[IsGranted('ROLE_USER', message: 'Vous devez être connecté pour confirmer une réservation')]
    public function confirm($slug, AdRepository $adRepository, Request $request): Response
    {
        $ad = $adRepository->findOneBy(['slug' => $slug]);
    
        if (!$ad) {
            return new JsonResponse(['error' => "L'annonce demandée n'existe pas"], 404);
        }
    
        $form = $this->createForm(BookingFormType::class);
        $form->handleRequest($request);
    
        if ($form->isSubmitted() && $form->isValid()) {
            $user = $this->getUser();
            /** @var Booking */
            $booking = $form->getData();
            $booking->setBooker($user)->setAd($ad);
    
            if (!$booking->isBookableDates() || !$booking->areDatesContinuous()) {
                return new JsonResponse(['error' => "Les dates que vous avez choisies ne peuvent être réservées : elles sont déjà prises."], 400);
            } else {
                $this->em->persist($booking);
                $this->em->flush();

                return new JsonResponse(['success' => true, 'redirect' => $this->generateUrl('booking_payment_form', ['id' => $booking->getId()])]);
            }
        }
    
        $errors = [];
        foreach ($form->getErrors(true) as $error) {
            $errors[] = $error->getMessage();
        }
    
        return new JsonResponse(['error' => 'Invalid form submission', 'errors' => $errors], 400);
    }
}