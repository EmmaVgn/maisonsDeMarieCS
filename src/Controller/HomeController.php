<?php

namespace App\Controller;

use App\Repository\AdRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class HomeController extends AbstractController
{
    #[Route('/', name: 'homepage')]
    public function index(AdRepository $adRepository): Response
    {
        $ads = $adRepository->findAll();

        return $this->render('home/index.html.twig', [
            'ads' => $ads,
        ]);
    }

    #[Route('/mentions-legales', name: 'mentions_legales')]
    public function mentions (): Response
    {

        return $this->render('legalies/index.html.twig', [
        ]);
    }

    
}
