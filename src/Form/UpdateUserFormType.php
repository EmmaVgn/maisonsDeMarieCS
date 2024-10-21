<?php

namespace App\Form;

use App\Entity\User;
use libphonenumber\PhoneNumberFormat;
use Misd\PhoneNumberBundle\Form\Type\PhoneNumberType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;

class UpdateUserFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('firstname', TextType::class, [
                'label' => 'Votre prénom :',
                'constraints' => [
                    new Length([
                        'min' => 2,
                        'max' => 30,
                        'minMessage' => 'Votre prénom doit comporter au moins {{ limit }} caractères',
                        'maxMessage' => 'Votre prénom ne peut excéder {{ limit }} caractères',
                    ]),
                    new NotBlank(['message' => 'Merci de saisir votre prénom']),
                ],
                'attr' => [
                    'placeholder' => 'Merci de saisir votre prénom'
                ]
            ])
            ->add('lastname', TextType::class, [
                'label' => 'Votre nom :',
                'constraints' => [
                    new Length([
                        'min' => 2,
                        'minMessage' => 'Votre nom doit comporter au moins {{ limit }} caractères'
                    ]),
                    new NotBlank(['message' => 'Merci de saisir votre nom']),
                ],
                'attr' => [
                    'placeholder' => 'Merci de saisir votre nom'
                ]
            ])
            ->add('email', EmailType::class, [
                'label' => 'Votre email :',
                'disabled' => true,
                'required' => true,
                'attr' => [
                    'placeholder' => 'Merci de saisir votre adresse email'
                ],
                'constraints' => new Email(['message' => 'Merci d\'indiquer une adresse email valide.'])
            ])
            ->add('adress', TextType::class, [
                'label' => 'Votre adresse :',
                'constraints' => new NotBlank(['message' => 'Merci d\'indiquer votre adresse']),
                'attr' => [
                    'placeholder' => 'Merci de saisir votre adresse'
                ]
            ])
            ->add('postalCode', TextType::class, [
                'label' => 'Votre code postal :',
                'constraints' => new NotBlank(['message' => 'Merci d\'indiquer votre code postal']),
                'attr' => [
                    'placeholder' => 'Merci de saisir votre code postal'
                ]
            ])
            ->add('city', TextType::class, [
                'label' => 'Votre ville :',
                'constraints' => new NotBlank(['message' => 'Merci d\'indiquer votre ville']),
                'attr' => [
                    'placeholder' => 'Merci de saisir votre ville'
                ]
            ])
            ->add('phone', PhoneNumberType::class, [
                'default_region' => 'FR',
                'format' => PhoneNumberFormat::NATIONAL,
                'label' => 'Votre téléphone :',
                'attr' => [
                    'placeholder' => 'Merci de saisir votre téléphone'
                ],
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => User::class,
        ]);
    }
}
