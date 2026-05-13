import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useCountries, useCreateCountry, useUpdateCountry } from '../hooks/useCountries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Save, ArrowLeft, Globe, MapPin, Users, Phone, Mail, Building, Image as ImageIcon, Briefcase, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CountryLogoUpload } from '../components/CountryLogoUpload';
import type { Country } from '../types';

const REGIONS = [
    "CEDEAO",
    "CEEAC",
    "SADC",
    "EAC",
    "UMA",
    "CEN-SAD",
    "COMESA",
    "CEMAC",
    "IGAD",
];

export default function CountryFormPage() {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('basic');
    const { data: countries = [], isLoading: isCountriesLoading } = useCountries();
    const createCountry = useCreateCountry();
    const updateCountry = useUpdateCountry();
    const { toast } = useToast();

    const [formData, setFormData] = useState<Partial<Country>>({
        name_fr: '',
        name_en: '',
        code_iso: '',
        region: '',
        official_name: '',
        flag_url: '',
        description: '',
        population: '',
        capital: '',
        fsu_established: '',
        fsu_budget: '',
        fsu_coordinator_name: '',
        fsu_coordinator_email: '',
        fsu_coordinator_phone: '',
        logo_path: '',
    });

    useEffect(() => {
        if (id && countries.length > 0) {
            const country = countries.find(c => c.id === id);
            if (country) {
                setFormData({
                    name_fr: country.name_fr || '',
                    name_en: country.name_en || '',
                    code_iso: country.code_iso || '',
                    region: country.region || '',
                    official_name: country.official_name || '',
                    flag_url: country.flag_url || '',
                    description: country.description || '',
                    population: country.population || '',
                    capital: country.capital || '',
                    fsu_established: country.fsu_established || '',
                    fsu_budget: country.fsu_budget || '',
                    fsu_coordinator_name: country.fsu_coordinator_name || '',
                    fsu_coordinator_email: country.fsu_coordinator_email || '',
                    fsu_coordinator_phone: country.fsu_coordinator_phone || '',
                    logo_path: country.logo_path || '',
                });
            }
        }
    }, [id, countries]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSelectChange = (id: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!formData.name_fr || !formData.name_en || !formData.code_iso || !formData.region) {
            toast({
                title: t('common.error'),
                description: t('admin.fillRequiredFields', 'Veuillez remplir tous les champs obligatoires (*)'),
                variant: 'destructive',
            });
            return;
        }

        const payload = {
            name_fr: formData.name_fr,
            name_en: formData.name_en,
            code_iso: (formData.code_iso || '').toUpperCase().slice(0, 2),
            region: formData.region,
            official_name: formData.official_name,
            flag_url: formData.flag_url,
            description: formData.description,
            population: formData.population,
            capital: formData.capital,
            fsu_established: formData.fsu_established,
            fsu_budget: formData.fsu_budget,
            fsu_coordinator_name: formData.fsu_coordinator_name,
            fsu_coordinator_email: formData.fsu_coordinator_email,
            fsu_coordinator_phone: formData.fsu_coordinator_phone,
            logo_path: formData.logo_path,
        } as Omit<Country, "id" | "created_at" | "updated_at">;

        try {
            if (id) {
                await updateCountry.mutateAsync({ id, ...(payload as Partial<Country>) });
                toast({ title: t('admin.countryUpdated', 'Pays mis à jour avec succès') });
            } else {
                await createCountry.mutateAsync(payload);
                toast({ title: t('admin.countryAdded', 'Pays ajouté avec succès') });
            }
            navigate('/admin/countries');
        } catch (error) {
            console.error('Error saving country:', error);
            toast({
                title: t('common.error'),
                description: t('common.errorOccurred'),
                variant: 'destructive',
            });
        }
    };

    if (id && isCountriesLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="w-full max-w-none animate-fade-in" style={{ margin: '-1rem', width: 'calc(100% + 2rem)' }}>
            <div className="p-4 lg:p-6 pt-6 lg:pt-8">
                <div className="flex items-center justify-between mb-6">
                    <Button variant="ghost" onClick={() => navigate('/admin/countries')} className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        {t('common.back', 'Retour')}
                    </Button>
                    <div className="flex items-center gap-4">
                        <Button 
                            onClick={() => handleSubmit()} 
                            disabled={createCountry.isPending || updateCountry.isPending}
                            className="gap-2 shadow-lg"
                        >
                            {createCountry.isPending || updateCountry.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            {id ? t('common.update', 'Mettre à jour') : t('common.save', 'Enregistrer')}
                        </Button>
                    </div>
                </div>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold">
                        {id ? t('admin.editCountry', 'Modifier le Pays') : t('admin.createCountry', 'Nouveau Pays')}
                    </h1>
                    <p className="text-muted-foreground">
                        {id ? formData.name_fr : t('admin.createCountryDesc', 'Ajouter un nouveau pays membre à la plateforme')}
                    </p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 w-full">
                    <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full max-w-2xl bg-muted/50 p-1">
                        <TabsTrigger value="basic" className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            {t('admin.basicInfo', 'Informations')}
                        </TabsTrigger>
                        <TabsTrigger value="fsu" className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            FSU
                        </TabsTrigger>
                        <TabsTrigger value="contact" className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {t('admin.coordinator', 'Coordinateur')}
                        </TabsTrigger>
                        <TabsTrigger value="media" className="flex items-center gap-2">
                            <ImageIcon className="h-4 w-4" />
                            Médias
                        </TabsTrigger>
                    </TabsList>

                    <Card className="border-none shadow-md bg-white overflow-hidden rounded-xl">
                        <CardContent className="p-6 lg:p-8">
                            <TabsContent value="basic" className="space-y-8 mt-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    <div className="space-y-3">
                                        <Label htmlFor="name_fr" className="text-sm font-semibold text-slate-700">Nom français *</Label>
                                        <Input 
                                            id="name_fr" 
                                            value={formData.name_fr}
                                            onChange={handleInputChange}
                                            placeholder="ex: Côte d'Ivoire"
                                            className="h-11 bg-slate-50/50 focus:bg-white transition-all border-slate-200"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="name_en" className="text-sm font-semibold text-slate-700">Nom anglais *</Label>
                                        <Input 
                                            id="name_en" 
                                            value={formData.name_en}
                                            onChange={handleInputChange}
                                            placeholder="ex: Ivory Coast"
                                            className="h-11 bg-slate-50/50 focus:bg-white transition-all border-slate-200"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="code_iso" className="text-sm font-semibold text-slate-700">Code ISO (2 car.) *</Label>
                                        <Input 
                                            id="code_iso" 
                                            value={formData.code_iso}
                                            onChange={handleInputChange}
                                            maxLength={2}
                                            placeholder="CI"
                                            className="uppercase h-11 bg-slate-50/50 focus:bg-white transition-all border-slate-200"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="region" className="text-sm font-semibold text-slate-700">Région *</Label>
                                        <Select 
                                            value={formData.region}
                                            onValueChange={(val) => handleSelectChange('region', val)}
                                        >
                                            <SelectTrigger className="h-11 bg-slate-50/50 focus:bg-white transition-all border-slate-200">
                                                <SelectValue placeholder="Sélectionner une région" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {REGIONS.map((region) => (
                                                    <SelectItem key={region} value={region}>
                                                        {region}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-3 lg:col-span-2">
                                        <Label htmlFor="official_name" className="text-sm font-semibold text-slate-700">Nom officiel</Label>
                                        <Input 
                                            id="official_name" 
                                            value={formData.official_name}
                                            onChange={handleInputChange}
                                            placeholder="ex: République de Côte d'Ivoire"
                                            className="h-11 bg-slate-50/50 focus:bg-white transition-all border-slate-200"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="capital" className="text-sm font-semibold text-slate-700">Capitale</Label>
                                        <Input 
                                            id="capital" 
                                            value={formData.capital}
                                            onChange={handleInputChange}
                                            placeholder="ex: Yamoussoukro"
                                            className="h-11 bg-slate-50/50 focus:bg-white transition-all border-slate-200"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="population" className="text-sm font-semibold text-slate-700">Population</Label>
                                        <Input 
                                            id="population" 
                                            value={formData.population}
                                            onChange={handleInputChange}
                                            placeholder="ex: 26 millions"
                                            className="h-11 bg-slate-50/50 focus:bg-white transition-all border-slate-200"
                                        />
                                    </div>
                                    <div className="space-y-3 md:col-span-2 lg:col-span-3">
                                        <Label htmlFor="description" className="text-sm font-semibold text-slate-700">Description</Label>
                                        <Textarea 
                                            id="description" 
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={5}
                                            placeholder="Description détaillée du pays..."
                                            className="bg-slate-50/50 focus:bg-white transition-all border-slate-200 resize-none"
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="fsu" className="space-y-8 mt-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <Label htmlFor="fsu_established" className="text-sm font-semibold text-slate-700">Année d'établissement de la FSU</Label>
                                        <Input 
                                            id="fsu_established" 
                                            value={formData.fsu_established}
                                            onChange={handleInputChange}
                                            placeholder="ex: 2012"
                                            className="h-11 bg-slate-50/50 focus:bg-white transition-all border-slate-200"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="fsu_budget" className="text-sm font-semibold text-slate-700">Budget FSU annuel</Label>
                                        <Input 
                                            id="fsu_budget" 
                                            value={formData.fsu_budget}
                                            onChange={handleInputChange}
                                            placeholder="ex: 1.5M USD"
                                            className="h-11 bg-slate-50/50 focus:bg-white transition-all border-slate-200"
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="contact" className="space-y-8 mt-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3 md:col-span-2">
                                        <Label htmlFor="fsu_coordinator_name" className="text-sm font-semibold text-slate-700">Nom du coordinateur</Label>
                                        <div className="relative">
                                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input 
                                                id="fsu_coordinator_name" 
                                                value={formData.fsu_coordinator_name}
                                                onChange={handleInputChange}
                                                className="pl-10 h-11 bg-slate-50/50 focus:bg-white transition-all border-slate-200"
                                                placeholder="Nom complet"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="fsu_coordinator_email" className="text-sm font-semibold text-slate-700">Email du coordinateur</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input 
                                                id="fsu_coordinator_email" 
                                                value={formData.fsu_coordinator_email}
                                                onChange={handleInputChange}
                                                className="pl-10 h-11 bg-slate-50/50 focus:bg-white transition-all border-slate-200"
                                                placeholder="email@example.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="fsu_coordinator_phone" className="text-sm font-semibold text-slate-700">Téléphone du coordinateur</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input 
                                                id="fsu_coordinator_phone" 
                                                value={formData.fsu_coordinator_phone}
                                                onChange={handleInputChange}
                                                className="pl-10 h-11 bg-slate-50/50 focus:bg-white transition-all border-slate-200"
                                                placeholder="+225 ..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="media" className="space-y-8 mt-0">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                    <div className="space-y-4">
                                        <Label className="text-sm font-semibold text-slate-700">Drapeau du pays (URL)</Label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input 
                                                id="flag_url" 
                                                value={formData.flag_url}
                                                onChange={handleInputChange}
                                                className="pl-10 h-11 bg-slate-50/50 focus:bg-white transition-all border-slate-200"
                                                placeholder="https://..."
                                            />
                                        </div>
                                        {formData.flag_url && (
                                            <div className="mt-4 border-2 border-dashed border-slate-200 rounded-xl p-6 bg-slate-50 flex flex-col items-center gap-3">
                                                <img src={formData.flag_url} alt="Drapeau" className="h-32 w-auto object-contain shadow-md rounded" />
                                                <span className="text-xs text-slate-400 font-medium">Prévisualisation du drapeau</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-4">
                                        <Label className="text-sm font-semibold text-slate-700">Logo institutionnel (Upload)</Label>
                                        <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-4">
                                            <CountryLogoUpload 
                                                countryCode={formData.code_iso || 'country'} 
                                                value={formData.logo_path}
                                                onChange={(path) => setFormData(prev => ({ ...prev, logo_path: path }))}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </CardContent>
                    </Card>
                </Tabs>
            </div>
        </div>
    );
}
