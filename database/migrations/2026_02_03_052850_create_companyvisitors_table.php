<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('companyvisitors', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('name');
            $table->string('customer_number');
            $table->string('companyname');
            $table->string('position')->nullable();
            $table->string('salary')->nullable();
            $table->string('income_type')->nullable();
            $table->string('percent')->nullable();
            $table->string('income')->nullable();
            $table->string('status');
            $table->string('payment_status')->nullable();
            $table->string('payment_method')->nullable();
            $table->string('citizenship')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companyvisitors');
    }
};
