<?php

namespace App\Twig;

use Twig\TwigFilter;
use Twig\Extension\AbstractExtension;

class AmountExtension extends AbstractExtension
{
    public function getFilters(): array
    {
        return [
            new TwigFilter('amount', [$this, 'amount'])
        ];
    }

    public function amount($value, string $symbol = '€', string $decsep = ',', string $thousandsep = ' ')
    {
        $finalValue = $value / 100;
        $finalValue = number_format($finalValue, 0, $decsep, $thousandsep);

        return $finalValue . ' ' . $symbol;
    }
}