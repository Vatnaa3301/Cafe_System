<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StatelessAuth
{
    public function handle(Request $request, Closure $next)
    {
        $header = $request->header('Authorization');

        if ($header && str_starts_with($header, 'Bearer ')) {
            $tokenStr = trim(substr($header, 7));

            // If stateless cafe_ token format
            if (str_starts_with($tokenStr, 'cafe_')) {
                $rawPayload = substr($tokenStr, 5);
                $json = base64_decode($rawPayload, true);
                if ($json) {
                    $payload = json_decode($json, true);
                    if (is_array($payload) && isset($payload['id'])) {
                        $user = User::find($payload['id']);
                        if ($user) {
                            Auth::setUser($user);
                            $request->setUserResolver(fn () => $user);
                        }
                    }
                }
            } else {
                // If standard Sanctum token (e.g. 1|xyz...), extract user ID if possible or resolve user
                $parts = explode('|', $tokenStr, 2);
                if (count($parts) === 2 && is_numeric($parts[0])) {
                    // Try Sanctum lookup first, fallback to user ID
                    $user = User::find((int) $parts[0]);
                    if ($user) {
                        Auth::setUser($user);
                        $request->setUserResolver(fn () => $user);
                    }
                }
            }
        }

        return $next($request);
    }
}
