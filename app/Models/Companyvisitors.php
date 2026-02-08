<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Companyvisitors extends Model
{
    //
    protected $fillable = [
        'date',
        'name',
        'customer_number',
        'companyname',
        'position',
        'salary',
        'income_type',
        'percent',
        'income',
        'status',
        'payment_status',
        'payment_method',
        'citizenship',
    ];
}
