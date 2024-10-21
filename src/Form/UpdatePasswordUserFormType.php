<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints\Regex;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Security\Core\Validator\Constraints\UserPassword;

class UpdatePasswordUserFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('oldPassword', PasswordType::class, [
                'label' => 'Mot de passe actuel',
                'label_attr' => [
                    'class' => 'lh-label fw-medium'
                ],
                'mapped' => false,
                'required' => true,
                'attr' => [
                    'placeholder' => 'Mot de passe actuel',
                    'class' => 'prepend-input'
                ],
                'constraints' => [
                    new UserPassword([
                        'message' => 'Mauvaise valeur pour votre mot de passe actuel',
                    ])
                ]
            ])
            ->add('newPassword', RepeatedType::class, [
                'type' => PasswordType::class,
                'required' => true,
                'invalid_message' => 'Le mot de passe et la confirmation doivent être identiques',
                'mapped' => false,
                'attr' => [
                    'autocomplete' => 'new-password',
                    'placeholder' => 'Merci de saisir votre mot de passe'
                ],
                'constraints' => [
                    new Regex([
                        'pattern' => '/^(?=.*[a-zà-ÿ])(?=.*[A-ZÀ-Ý])(?=.*[0-9])(?=.*[^a-zà-ÿA-ZÀ-Ý0-9]).{12,}$/',
                        'message' => 'Pour des raisons de sécurité, votre mot de passe doit contenir au minimum 12 caractères dont 1 lettre majuscule, 1 lettre minuscule, 1 chiffre et 1 caractère spécial.'
                    ])
                ],
                'first_options' => [
                    'label' => 'Nouveau mot de passe',
                    'label_attr' => [
                        'class' => 'lh-label fw-medium'
                    ],
                    'attr' => [
                        'placeholder' => 'Entrez votre nouveau mot de passe',
                        'class' => 'prepend-input'
                    ]
                ],
                'second_options' => [
                    'label' => 'Confirmer le nouveau mot de passe',
                    'label_attr' => [
                        'class' => 'lh-label fw-medium'
                    ],
                    'attr' => [
                        'placeholder' => 'Confirmer le nouveau mot de passe',
                        'class' => 'prepend-input'
                    ]
                ]
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => User::class,
        ]);
    }
}
