-- Keep the leads table in sync with the budget bands submitted by the
-- discovery form and lead-capture popup. Legacy values remain valid so
-- existing leads are not affected when this constraint is replaced.

alter table public.leads
  drop constraint if exists leads_budget_band_check;

alter table public.leads
  add constraint leads_budget_band_check
  check (
    budget_band in (
      '1-2cr',
      '3-4cr',
      '5-7cr',
      '8-10cr',
      '10cr-plus',
      '3-5cr',
      '5-10cr',
      'custom'
    )
  );

create or replace function public.compute_is_hot()
returns trigger language plpgsql as $$
begin
  new.is_hot := (
    new.budget_band is not null
    and new.budget_band in ('5-7cr', '8-10cr', '5-10cr', '10cr-plus')
    and new.timeline is not null
    and new.timeline in ('immediately', '1-3months')
    and new.phone is not null
    and new.phone != ''
  );
  return new;
end;
$$;
