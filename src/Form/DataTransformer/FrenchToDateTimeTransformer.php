<?php

namespace App\Form\DataTransformer;

use DateTimeImmutable;
use Symfony\Component\Form\DataTransformerInterface;

class FrenchToDateTimeTransformer implements DataTransformerInterface
{
    public function transform($date): string
    {
        if (null === $date) {
            return '';
        }

        return $date->format('d/m/Y');
    }

    public function reverseTransform($frenchDate): DateTimeImmutable
    {
        if (null === $frenchDate) {
            return null;
        }

    // Convertir la chaîne de date du format "jj.mm.aaaa" en objet DateTimeImmutable
    $date = \DateTimeImmutable::createFromFormat('d.m.Y', $frenchDate);

    return $date ? $date : null;
    }
}