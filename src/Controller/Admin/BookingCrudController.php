<?php

namespace App\Controller\Admin;

use App\Entity\Booking;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\MoneyField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;

class BookingCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Booking::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setPageTitle('index', 'Réservations :')
            ->setPageTitle('new', 'Créer une réservation')
            ->setPaginatorPageSize(10)
            ->setPageTitle('detail', fn (Booking $booking) => (string) $booking->getAd()->getName());
    }

    public function configureActions(Actions $actions): Actions
    {
        $actions = parent::configureActions($actions);
        $actions->remove(Crud::PAGE_INDEX, Action::NEW)
            ->remove(Crud::PAGE_INDEX, Action::EDIT)
            ->add(Crud::PAGE_INDEX, Action::DETAIL);
        return $actions;
    }

    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id')->hideOnIndex(),
            AssociationField::new('ad', 'Annonce'),
            DateField::new('startDateAt', 'Date d\'arrivée')
                ->setFormat('short')
                ->renderAsChoice(),
            DateField::new('endDateAt', 'Date d\'arrivée')
                ->setFormat('short')
                ->renderAsChoice(),
            DateField::new('createdAt', 'Crée le')
                ->setFormat('short')
                ->renderAsChoice(),
            MoneyField::new('amount', 'Montant')
                ->setCurrency('EUR')
                ->setTextAlign('left')
                ->setFormTypeOption('divisor', 100),
            TextField::new('status', 'Statut'),
            AssociationField::new('booker', 'Client')
        ];
    }
}
