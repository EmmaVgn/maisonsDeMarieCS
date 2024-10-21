<?php

namespace App\Service;

use App\Entity\Ad;

class EquipmentService
{
    public function getAllEquipmentsByCriteria(Ad $ad): array
    {
        // Regrouper les équipements par critères
        $equipmentsAllByCriteria = [];
        foreach ($ad->getEquipment() as $equipment) {
            $criteria = $equipment->getCriteria();
            if (!isset($equipmentsAllByCriteria[$criteria->getName()])) {
                $equipmentsAllByCriteria[$criteria->getName()] = [];
            }
            $equipmentsAllByCriteria[$criteria->getName()][] = $equipment;
        }
        return $equipmentsAllByCriteria;
    }

    public function getEquipmentsByCriteria(Ad $ad): array
    {
        // Regrouper les équipements par critères
        $equipmentsByCriteria = [];
        foreach ($ad->getEquipment() as $equipment) {
            $criteria = $equipment->getCriteria();
            if (!isset($equipmentsByCriteria[$criteria->getName()])) {
                $equipmentsByCriteria[$criteria->getName()] = [
                    'criteria' => $criteria,
                    'equipments' => []
                ];
            }
            $equipmentsByCriteria[$criteria->getName()]['equipments'][] = $equipment;
        }

        // Si le nombre total d'équipements est inférieur ou égal à 8, retourner tous les équipements
        $totalEquipments = array_reduce($equipmentsByCriteria, function($carry, $item) {
            return $carry + count($item['equipments']);
        }, 0);

        if ($totalEquipments <= 8) {
            return $equipmentsByCriteria;
        }

        // Sinon, sélectionner 8 équipements en suivant la logique spécifiée
        $selectedEquipments = [];
        $indexes = array_fill_keys(array_keys($equipmentsByCriteria), 0);
        while (count($selectedEquipments) < 8) {
            foreach ($equipmentsByCriteria as $criteriaName => $criteriaData) {
                if (count($selectedEquipments) >= 8) {
                    break;
                }
                $index = $indexes[$criteriaName];
                if (isset($criteriaData['equipments'][$index])) {
                    $selectedEquipments[] = $criteriaData['equipments'][$index];
                    $indexes[$criteriaName]++;
                }
            }
        }

        // Regrouper les équipements sélectionnés par critères
        $result = [];
        foreach ($selectedEquipments as $equipment) {
            $criteria = $equipment->getCriteria();
            if (!isset($result[$criteria->getName()])) {
                $result[$criteria->getName()] = [
                    'criteria' => $criteria,
                    'equipments' => []
                ];
            }
            $result[$criteria->getName()]['equipments'][] = $equipment;
        }

        return $result;
    }
}
