<?php

namespace App\Controller;

use App\Entity\Contact;
use App\Form\ContactFormType;
use App\Service\SendMailService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ContactController extends AbstractController
{
    #[Route('/contact', name: 'contact')]
    public function index(Request $request, EntityManagerInterface $em, SendMailService $mail): Response
    {
        $contact = new Contact;
        $form = $this->createForm(ContactFormType::class, $contact);

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $firstname = ucwords($form->get('firstname')->getData());
            $lastname = mb_strtoupper($form->get('lastname')->getData());
            $contact->setFirstname($firstname)
                ->setLastname($lastname);

            $em->persist($contact);
            $em->flush();

            $mail->sendEmail(
                'contact@cameleon-solutions.fr',
                'Demande de contact',
                'contact@cameleon-solutions.fr',
                'Demande de contact',
                'contact',
                ['contact' => $contact]
            );
            

            $this->addFlash('success', 'Votre demande de contact a été envoyée');
            return $this->redirectToRoute('homepage');
        }

        return $this->render('contact/index.html.twig', [
            'form' => $form,
        ]);
    }
}