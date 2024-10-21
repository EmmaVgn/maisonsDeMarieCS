<?php

namespace App\Controller;

use App\Entity\Booking;
use App\Form\BookingFormType;
use App\Repository\AdRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class AdController extends AbstractController
{
    #[Route('/ads', name: 'ads_index')]
    public function index(AdRepository $adRepository): Response
    {
        $ads = $adRepository->findAll();
        return $this->render('ad/index.html.twig', [
            'ads' => $ads, // Correctement passé ici
        ]);
    }

    #[Route('/ads/{slug}', name: 'ads_show', priority: -1)]
    public function show($slug, AdRepository $adRepository): Response
    {
        $booking = new Booking;
        $ad = $adRepository->findOneBy(['slug' => $slug]);

        if (!$ad) {
            throw $this->createNotFoundException("L'annonce demandée n'existe pas");
        }

        $notAvailableDays = $ad->getNotAvailableDays();
        $form = $this->createForm(BookingFormType::class, $booking);

        return $this->render('ad/show.html.twig', [
            'ad' => $ad,
            'form' => $form->createView(),
            'notAvailableDays' => $notAvailableDays,
        ]);
    }
}
