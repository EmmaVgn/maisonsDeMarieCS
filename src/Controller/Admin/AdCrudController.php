<?php

namespace App\Controller\Admin;

use App\Entity\Ad;
use App\Entity\User;
use App\Entity\Equipment;
use App\Form\AdImageFormType;
use Doctrine\ORM\QueryBuilder;
use Doctrine\ORM\EntityManagerInterface;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateField;
use EasyCorp\Bundle\EasyAdminBundle\Field\FormField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\MoneyField;
use EasyCorp\Bundle\EasyAdminBundle\Field\NumberField;
use EasyCorp\Bundle\EasyAdminBundle\Field\CountryField;
use EasyCorp\Bundle\EasyAdminBundle\Field\CollectionField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;

class AdCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Ad::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setPageTitle('index', 'Annonces :')
            ->setPageTitle('new', 'Créer une annonce')
            ->setPaginatorPageSize(10)
            ->setEntityLabelInSingular('une Annonce')
            ->setPageTitle('edit', fn (Ad $ad) => (string) 'Modifier ' . $ad->getName())
            ->setPageTitle('detail', fn (Ad $ad) => (string) 'Modifier ' . $ad->getName());
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id')->onlyOnIndex(),
            FormField::addColumn(6),
            TextField::new('name', 'Nom de l\'annonce'),
            MoneyField::new('price', 'Prix de la nuitée')
                ->setCurrency('EUR')
                ->setTextAlign('left')
                ->setFormTypeOption('divisor', 100),
            NumberField::new('capacity', 'Capacité du logement')->setNumDecimals(0),
            NumberField::new('rooms', 'Nombre de chambre')->setNumDecimals(0),
            NumberField::new('beds', 'Nombre de lits')->setNumDecimals(0),
            DateField::new('createdAt', 'Date de création')
                ->setFormat('long')
                ->renderAsChoice()
                ->onlyOnIndex(),
            CollectionField::new('images', 'Images')
                ->setEntryType(AdImageFormType::class)
                ->setFormTypeOption('by_reference', false)
                ->hideOnIndex(),
            AssociationField::new('equipment', 'Équipements')
                ->setQueryBuilder(
                    fn (QueryBuilder $queryBuilder) => $queryBuilder->getEntityManager()->getRepository(Equipment::class)->createQueryBuilder('e')->orderBy('e.name')
                )
                ->setFormTypeOption('by_reference', false)
                ->autocomplete()
                ->hideOnIndex(),
            FormField::addColumn(6),
            TextField::new('city', 'Ville de l\'annonce')->hideOnIndex(),
            CountryField::new('country', 'Pays de l\'annonce')->hideOnIndex(),
            TextEditorField::new('content', 'Contenu de l\'annonce')->hideOnIndex(),
        ];
    }

    public function persistEntity(EntityManagerInterface $entityManager, $entityInstance): void
    {
        $entityInstance->setCity(ucfirst($entityInstance->getCity()));
        parent::persistEntity($entityManager, $entityInstance);
    }

    public function updateEntity(EntityManagerInterface $entityManager, $entityInstance): void
    {
        $entityInstance->setCity(ucfirst($entityInstance->getCity()));
        parent::updateEntity($entityManager, $entityInstance);
    }

}