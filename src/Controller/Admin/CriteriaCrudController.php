<?php

namespace App\Controller\Admin;

use App\Entity\Criteria;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;

class CriteriaCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Criteria::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setPageTitle('index', 'Critères :')
            ->setPageTitle('new', 'Créer un critère')
            ->setPageTitle('edit', fn (Criteria $criteria) => (string) $criteria->getName())
            ->setEntityLabelInSingular('un Critère')
            ->setPaginatorPageSize(10);
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id', 'ID')->onlyOnIndex(),
            TextField::new('name', 'Nom du critère')
            ->setFormTypeOptions(['attr' => ['placeholder' => 'Ex: Salle de bain']]),
            TextField::new('slug', 'Slug')->onlyOnIndex(),
        ];
    }
}