<?php

namespace App\Form;

use App\Entity\Booking;
use App\Form\DataTransformer\FrenchToDateTimeTransformer;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\TextType;

class BookingFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('startDateAt', TextType::class, [
                'label' => 'Date d\'arrivée',
                // 'widget' => 'single_text', // Utiliser un widget de type texte
                // 'html5' => false, // Désactiver le support HTML5 pour le widget de formulaire
                // 'format' => 'dd.MM.yyyy',
                'attr' => [
                    'class' => 'flatpickr flatpickr-input'
                ]
            ])
            ->add('endDateAt', TextType::class, [
                'label' => 'Date de départ',
                // 'widget' => 'single_text',
                // 'html5' => false,
                // 'format' => 'dd.MM.yyyy',
                'attr' => [
                    'class' => 'flatpickr flatpickr-input toto'
                ]
            ]);

        // Utilisation du Datatransformer
        $builder->get('startDateAt')->addModelTransformer(new FrenchToDateTimeTransformer);
        $builder->get('endDateAt')->addModelTransformer(new FrenchToDateTimeTransformer);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Booking::class,
        ]);
    }
}
