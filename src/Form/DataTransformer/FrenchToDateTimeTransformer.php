<?php

namespace App\Form\DataTransformer;

use DateTimeImmutable;
use Symfony\Component\Form\DataTransformerInterface;
use InvalidArgumentException;

class FrenchToDateTimeTransformer implements DataTransformerInterface
{
    public function transform($date): string
    {
        if (null === $date) {
            return '';
        }

        return $date->format('d/m/Y'); // Assurez-vous que le format est celui souhaité
    }

    public function reverseTransform($frenchDate): ?DateTimeImmutable // Utilisation du type nullable
    {
        if (null === $frenchDate || $frenchDate === '') {
            return null; // Retourner null si aucune date n'est fournie
        }
    
        // Vérifier le format de la date
        $date = DateTimeImmutable::createFromFormat('d/m/Y', $frenchDate); // Ajustement ici
        
        // Vérifier si la conversion a échoué
        if ($date === false) {
            $errors = DateTimeImmutable::getLastErrors();
            $errorMessage = "Erreur de conversion de la date: ";
            
            if ($errors['warning_count'] > 0) {
                $errorMessage .= implode(", ", $errors['warnings']);
            }
            
            if ($errors['error_count'] > 0) {
                $errorMessage .= implode(", ", $errors['errors']);
            }
            
            // Enregistrer les erreurs pour le débogage
            error_log($errorMessage);
            throw new InvalidArgumentException($errorMessage); // Lever une exception au lieu de retourner null
        }
    
        return $date;
    }
}
