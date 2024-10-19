<?php

namespace App\DataFixtures;

use Faker\Factory;
use App\Entity\User;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    public function __construct(
        private UserPasswordHasherInterface $passwordEncoder,
        private SluggerInterface $slugger
    ){}

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        // Créer un administrateur
        $admin = new User();
        $admin->setEmail('admin@gmail.fr');
        $admin->setLastname('Vigneron');
        $admin->setFirstname('Emma');
        $admin->setPassword(
            $this->passwordEncoder->hashPassword($admin, 'admin')
        );
        $admin->setRoles(['ROLE_ADMIN']);
        $admin->setAdress($faker->streetAddress)
            ->setPostalCode($faker->postcode)
            ->setCity($faker->city)
            ->setPhone($faker->mobileNumber());

        // Persister l'administrateur
        $manager->persist($admin);

        // Créer plusieurs utilisateurs
        for ($u = 0; $u < 5; $u++) {
            $user = new User();
            $user->setEmail("user$u@gmail.com")
                ->setFirstname($faker->firstName())
                ->setLastname($faker->lastName())
                ->setPassword(
                    $this->passwordEncoder->hashPassword($user, 'secret')
                )
                ->setAdress($faker->streetAddress)
                ->setPostalCode($faker->postcode)
                ->setCity($faker->city)
                ->setPhone($faker->mobileNumber());

            // Persister chaque utilisateur
            $manager->persist($user);
        }

        // Flusher toutes les entités en une seule fois
        $manager->flush();
    }
}
