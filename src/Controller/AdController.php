<?php

namespace App\Controller;

use App\Entity\Booking;
use App\Form\BookingFormType;
use App\Repository\AdRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;

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

    #[Route('/api/ads/{slug}/not-available-days', name: 'ads_not_available_days', methods: ['GET'])]
    public function getNotAvailableDays($slug, AdRepository $adRepository): JsonResponse
    {
        $ad = $adRepository->findOneBy(['slug' => $slug]);
        if (!$ad) {
            return $this->json(['error' => 'Ad not found'], 404);
        }
        $notAvailableDays = $ad->getNotAvailableDays();
        $formattedDays = array_map(function ($day) {
            return $day->format('d.m.Y');
        }, $notAvailableDays);
        return $this->json($formattedDays);
    }
}
