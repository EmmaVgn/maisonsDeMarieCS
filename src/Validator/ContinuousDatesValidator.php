<?php

namespace App\Validator;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

class ContinuousDatesValidator extends ConstraintValidator
{
    public function validate($booking, Constraint $constraint): void
    {
        if (!$booking->areDatesContinuous()) {
            $this->context->buildViolation($constraint->message)
                ->atPath('startDateAt')
                ->addViolation();
        }
    }
}