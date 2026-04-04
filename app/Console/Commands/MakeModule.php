<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class MakeModule extends Command
{
    protected $signature = 'make:module {name}';
    protected $description = 'Create a new module';

    public function handle()
    {
        $name = ucfirst($this->argument('name'));
        $basePath = base_path("modules/{$name}");

        if (File::exists($basePath)) {
            $this->error("Module {$name} already exists!");
            return;
        }

        // Folder structure
        $folders = [
            'Http/Controllers',
            'Http/Requests',
            'Models',
            'Services',
            'Repositories',
            'Database/Migrations',
            'Database/Seeders',
        ];

        foreach ($folders as $folder) {
            File::makeDirectory("{$basePath}/{$folder}", 0755, true);
        }

        // Create routes file
        File::put("{$basePath}/routes.php", $this->getRoutesStub($name));

        // Create base service (optional)
        File::put("{$basePath}/Services/{$name}Service.php", $this->getServiceStub($name));

        $this->info("Module {$name} created successfully!");

        // Create Controller
        File::put(
            "{$basePath}/Http/Controllers/{$name}Controller.php",
            $this->getControllerStub($name)
        );

        // Create Model
        File::put(
            "{$basePath}/Models/{$name}.php",
            $this->getModelStub($name)
        );

        // Create Request
        File::put(
            "{$basePath}/Http/Requests/Store{$name}Request.php",
            $this->getRequestStub($name)
        );
    }

    protected function getRoutesStub($name)
    {
        return <<<PHP
    <?php

    use Illuminate\Support\Facades\Route;
    use Modules\\{$name}\\Http\\Controllers\\{$name}Controller;

    Route::prefix(strtolower('{$name}s'))->group(function () {
        Route::get('/', [{$name}Controller::class, 'index']);
    });
    PHP;
    }

    protected function getServiceStub($name)
    {
        return <<<PHP
    <?php

    namespace Modules\\{$name}\\Services;

    class {$name}Service
    {
        //
    }
    PHP;
    }

    protected function getControllerStub($name)
    {
        return <<<PHP
    <?php

    namespace Modules\\{$name}\\Http\\Controllers;

    use App\\Http\\Controllers\\Controller;
    use Modules\\{$name}\\Models\\{$name};

    class {$name}Controller extends Controller
    {
        public function index()
        {
            return response()->json({$name}::all());
        }
    }
    PHP;
    }    

    protected function getModelStub($name)
    {
        return <<<PHP
    <?php

    namespace Modules\\{$name}\\Models;

    use Illuminate\\Database\\Eloquent\\Model;

    class {$name} extends Model
    {
        protected \$guarded = [];
    }
    PHP;
    }    

    protected function getRequestStub($name)
    {
        return <<<PHP
    <?php

    namespace Modules\\{$name}\\Http\\Requests;

    use Illuminate\\Foundation\\Http\\FormRequest;

    class Store{$name}Request extends FormRequest
    {
        public function authorize(): bool
        {
            return true;
        }

        public function rules(): array
        {
            return [
                //
            ];
        }
    }
    PHP;
    }    
}