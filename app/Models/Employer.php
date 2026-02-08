<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employer extends Model
{
    //
    protected $fillable = [
        'name',
        'post',
        'location',
        'salary',
        'time',
        'contact_number',
        'experience',
    ];
}
