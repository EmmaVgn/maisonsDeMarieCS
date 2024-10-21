<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Avatar;
use App\Form\AvatarFormType;
use App\Form\UpdateUserFormType;
use App\Form\ChangeEmailFormType;
use App\Repository\UserRepository;
use App\Repository\AvatarRepository;
use App\Form\UpdatePasswordUserFormType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class ProfileController extends AbstractController
{

    #[Route('/profile/edit', name: 'profile_edit')]
    public function edit(Request $request, EntityManagerInterface $em, ValidatorInterface $validator, UserRepository $userRepository, UserPasswordHasherInterface $userPasswordHasher, AvatarRepository $avatarRepository): Response
    {
        /** @var User $user */
        $user = $this->getUser();

        // Gestion de la photo
        $avatar = $user->getAvatar();
        if ($avatar === null) {
            $avatar = new Avatar;
            $avatarForm = $this->createForm(AvatarFormType::class, $avatar);
            $avatarForm->handleRequest($request);
            if ($avatarForm->isSubmitted() && $avatarForm->isValid()) {
                $avatar->setUser($user);
                $em->persist($avatar);
                $em->flush();
                $this->addFlash('success', 'Le photo a bien été prise en compte !');
                return $this->redirectToRoute('profile_edit');
            }

        } else {
            $avatarForm = $this->createForm(AvatarFormType::class, $avatar);
            $avatarForm->handleRequest($request);
            if ($avatarForm->isSubmitted() && $avatarForm->isValid()) {
                $em->flush();
                $this->addFlash('success', 'La photo a bien été modifiée !');
                return $this->redirectToRoute('profile_edit');
            }
        }

        $form = $this->createForm(UpdateUserFormType::class, $user);
        $form2 = $this->createForm(ChangeEmailFormType::class, $user);
        $form->handleRequest($request);
        $form2->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $firstname = ucfirst($form->get('firstname')->getData());
            $city = ucfirst($form->get('city')->getData());
            $lastname = mb_strtoupper($form->get('lastname')->getData());
            $user->setFirstname($firstname)
                ->setLastname($lastname)
                ->setCity($city);
            $em->flush();
            $this->addFlash('success', 'Vos modifications ont bien été prises en compte');
            return $this->redirectToRoute('profile_edit');
        }

        if ($form2->isSubmitted() && $form2->isValid()) {
            $password = $form2->get('password_for_email')->getData();
            $email = $form2->get('new_email')->getData();
            $emailConstraint = new Email();
            $emailConstraint->message = 'L\'email ' . $email . ' n\'est pas une adresse email valide';
            // utilisation du validator afin de valider la valeur
            $errors = $validator->validate(
                $email,
                $emailConstraint
            );

            if ($errors->count()) {
                $this->addFlash('danger', $emailConstraint->message);
                return $this->redirectToRoute('profile_edit');
            }

            $userFound = $userRepository->findOneBy(['email' => $email]);
            if ($userFound) {
                $this->addFlash('danger', 'Cet email existe déjà. Merci d\'en choisir un autre');
                return $this->redirectToRoute('profile_edit');
            }

            if ($userPasswordHasher->isPasswordValid($user, $password)) {
                $user->setEmail($email);
                $em->flush();
                $this->addFlash('success', 'Votre email a bien été modifié. Il vous sert de nouvel identifiant pour vous connecter');
                return $this->redirectToRoute('profile_edit');

            } else {

                $this->addFlash('danger', 'Un problème est survenu');
                return $this->redirectToRoute('profile_edit');
            }
        }

        return $this->render('profile/edit.html.twig', [
            'formView' => $form->createView(),
            'form2' => $form2->createView(),
            'formAvatar' => $avatarForm->createView(),
            'user' => $user
        ]);
    }

    #[Route('/profile/editPassword', name: 'profile_editPassword')]
    public function editPassword(Request $request, EntityManagerInterface $em, UserPasswordHasherInterface $userPasswordHasher): Response
    {
        /** @var User $user */
        $user = $this->getUser();
        $form = $this->createForm(UpdatePasswordUserFormType::class, $user);

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $newPassword = $form->get('newPassword')->getData();
            $password = $userPasswordHasher->hashPassword($user, $newPassword);
            $user->setPassword($password);
            $em->flush();
            $this->addFlash('success', 'Votre mot de passe a bien été mis à jour');
            return $this->redirectToRoute('profile_edit');
        }

        return $this->render('profile/credentials.html.twig', [
            'form' => $form->createView(),
            'user' => $user
        ]);
    }

    #[Route('profile/user/{id}/delete', name: 'profile_delete')]
    public function delete(Request $request, User $user, UserRepository $userRepository)
    {
        /** @var User $user */
        $user = $this->getUser();
        if ($this->isCsrfTokenValid('delete'.$user->getId(), $request->request->get('_token'))) {
            $this->container->get('security.token_storage')->setToken(null);
            $userRepository->remove($user, true);
            $this->addFlash('success', 'Votre compte a bien été supprimé !');
        }

        return $this->redirectToRoute('homepage', [], Response::HTTP_SEE_OTHER);
    }
    
}
