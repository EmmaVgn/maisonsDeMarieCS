<?php

namespace App\Controller\Admin;

use App\Entity\Ad;
use App\Form\AdImageFormType;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\FormField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\MoneyField;
use EasyCorp\Bundle\EasyAdminBundle\Field\NumberField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\CollectionField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ImageField;

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
            ->setEntityLabelInSingular('une Annonce');
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
            DateField::new('createdAt', 'Date de création')
                ->setFormat('long')
                ->renderAsChoice()
                ->onlyOnIndex(),
            CollectionField::new('images', 'Images')
                ->setEntryType(AdImageFormType::class)
                ->setFormTypeOption('by_reference', false)
                ->hideOnIndex(),
            FormField::addColumn(6),
            TextEditorField::new('introduction', 'Description courte')->hideOnIndex(),
            TextEditorField::new('content', 'Contenu de l\'annonce')->hideOnIndex(),
        ];
    }
}