<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    //
    protected $fillable = [
        'name',
        'reference_by',
        'permanent_address',
        'temporary_address',
        'contact_number',
        'experience',
        'interested_in',
    ];
}
