<?php

declare(strict_types=1);

namespace Aurix\Auth;

/**
 * MunichTech EXPO-style RBAC: SUPER_ADMIN + staff vs participant personas.
 */
final class Roles
{
    public const SUPER_ADMIN_EMAIL = 'engahmed2055@gmail.com';

    public const STAFF = [
        'super_admin',
        'operations_manager',
        'sales_partnerships',
        'finance',
        'marketing',
        'compliance_officer',
        'support',
        'admin',
    ];

    public static function isFounderEmail(string $email): bool
    {
        return strtolower(trim($email)) === self::SUPER_ADMIN_EMAIL;
    }

    public static function forEmail(string $email, string $fallback = 'user'): string
    {
        return self::isFounderEmail($email) ? 'super_admin' : $fallback;
    }

    public static function isStaff(string $role): bool
    {
        return in_array($role, self::STAFF, true);
    }
}
