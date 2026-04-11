<?php

namespace App\Enums;

enum UserRole: string
{
    case Manager = 'manager';
    case Engineer = 'engineer';
    case Worker = 'worker';
    case Magasinier = 'magasinier';
    case ChefChantier = 'chef_chantier';
}
