<?php

namespace App\Controller;

use App\Repository\AdRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
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
        $ad = $adRepository->findOneBy(['slug' => $slug]);

        if (!$ad) {
            throw $this->createNotFoundException("L'annonce demandée n'existe pas");
        }

        return $this->render('ad/show.html.twig', [
            'ad' => $ad // Correctement passé ici
        ]);
    }
}
