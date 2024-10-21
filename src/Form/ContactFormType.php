<?php

namespace App\Form;

use App\Entity\Contact;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TelType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;

class ContactFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
        ->add('firstname', TextType::class, [
            'label' => false,
            'required' => true,
            'attr' => [
                'placeholder' => 'Prénom',
            ],
        ])
        ->add('lastname', TextType::class, [
            'label' => false,
            'required' => true,
            'attr' => [
                'placeholder' => 'Nom',
            ],
        ])
        ->add('email', EmailType::class, [
            'label' => false,
            'required' => true,
            'attr' => [
                'placeholder' => 'contact@lesmaisonsdemarie.net',
            ],
        ])
        ->add('phone', TelType::class, [
            'label' => false,
            'required' => false,
            'attr' => [
                'placeholder' => '01 02 03 04 05',
            ],
        ])
        ->add('content', TextareaType::class, [
            'label' => false,
            'required' => true,
            'row_attr' => ['rows' => '5'],
            'attr' => [
                'placeholder' => 'Votre demande',
            ],
        ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Contact::class,
        ]);
    }
}