<?php

namespace Database\Seeders;

use App\Models\RolePermission;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (RolePermission::defaultPermissions() as $role => $permissions) {
            RolePermission::updateOrCreate(
                ['role' => $role],
                ['permissions' => $permissions]
            );
        }
    }
}
