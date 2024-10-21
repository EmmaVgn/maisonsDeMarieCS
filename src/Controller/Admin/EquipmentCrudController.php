<?php

namespace App\Controller\Admin;

use App\Entity\Criteria;
use App\Entity\Equipment;
use Doctrine\ORM\QueryBuilder;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;

class EquipmentCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Equipment::class;
    }
    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setPageTitle('index', 'Equipements :')
            ->setPageTitle('new', 'Créer un équipement')
            ->setPageTitle('edit', fn (Equipment $equipment) => (string) $equipment->getName())
            ->setEntityLabelInSingular('un Equipement')
            ->setPaginatorPageSize(10);
    }
    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id', 'ID')->onlyOnIndex(),
            TextField::new('name', 'Nom de l\'équipement')
                ->setFormTypeOptions(['attr' => ['placeholder' => 'Ex: Chauffage']]),
            TextField::new('slug', 'Slug')->onlyOnIndex(),
            AssociationField::new('criteria', 'Critère')
                ->setQueryBuilder(
                    fn (QueryBuilder $queryBuilder) => $queryBuilder->getEntityManager()->getRepository(Criteria::class)->createQueryBuilder('c')->orderBy('c.name')
                )
                ->autocomplete(),
        ];
    }
}