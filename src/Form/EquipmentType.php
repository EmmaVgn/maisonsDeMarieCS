<?php

namespace App\Form;

use App\Entity\Equipment;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Doctrine\ORM\EntityRepository;

class EquipmentType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('equipment', EntityType::class, [
            'class' => Equipment::class,
            'choice_label' => function (Equipment $equipment) {
                return sprintf('%s', $equipment->getName());
            },
            'query_builder' => function (EntityRepository $er) {
                return $er->createQueryBuilder('e')
                          ->orderBy('e.name', 'ASC');
            },
            'group_by' => function (Equipment $equipment) {
                return $equipment->getCriteria()->getName();
            },
            'multiple' => true,
            'expanded' => true,
            'by_reference' => false,
        ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => null,
        ]);
    }
}
